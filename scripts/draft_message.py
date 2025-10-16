#!/usr/bin/env python3
# scripts/draft_message.py
import sys
import json
import datetime
import traceback

# safe imports
try:
    from transformers import pipeline, set_seed, logging as hf_logging
except Exception as e:
    err = {"error": "transformers_import_failed", "detail": str(e)}
    print(json.dumps(err))
    sys.exit(1)

# quiet HF logging (optional)
hf_logging.set_verbosity_error()

def make_generator():
    """
    Try GPU (device 0) then CPU (device -1). Return a pipeline object.
    """
    last_err = None
    for device in (0, -1):
        try:
            gen = pipeline("text-generation", model="distilgpt2", device=device)
            try:
                set_seed(42)
            except Exception:
                pass
            # ensure tokenizer has a pad token; if not, set it to eos
            tok = gen.tokenizer
            if getattr(tok, "pad_token", None) is None:
                # set pad token to eos if pad_token is missing (avoids some warnings)
                try:
                    tok.pad_token = tok.eos_token
                except Exception:
                    # ignore if tokenizer can't set pad token
                    pass
            return gen
        except Exception as e:
            last_err = e
            continue
    raise last_err

def safe_load_arg():
    if len(sys.argv) < 2:
        return {}
    raw = sys.argv[1]
    try:
        return json.loads(raw)
    except Exception:
        try:
            return json.loads(" ".join(sys.argv[1:]))
        except Exception:
            return {}

def make_recipient(student_name):
    local = student_name.lower().strip().replace(" ", "_")
    return f"parent_{local}@example.com"

def ensure_hello(s):
    s = s.strip()
    if not s.startswith("Hello,"):
        return "Hello, " + s
    return s

def build_message_from_model(student_name, alert_message, tone, generator):
    clean_alert = alert_message.split(" (Priority:")[0].strip()
    tone_instructions = {
        'empathetic': f"Generate a concise, empathetic email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' offer warm support like 'I’m here to support you.' Keep under 30 words.",
        'formal': f"Generate a concise, formal email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' use a professional directive like 'Immediate action is necessary.' Keep under 30 words.",
        'encouraging': f"Generate a concise, encouraging email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' be positive and motivating. Keep under 30 words.",
        'urgent': f"Generate a concise, urgent email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' insist on prompt action like 'Resolve this immediately.' Keep under 30 words.",
        'positive': f"Generate a concise, positive email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' celebrate progress. Keep under 30 words.",
        'informative': f"Generate a concise, informative email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' deliver a clear fact. Keep under 30 words."
    }
    instruction = tone_instructions.get(tone, f"Generate a concise email for {student_name}'s parent about {clean_alert}. Begin with 'Hello,' keep under 30 words.")

    # Prepare safe generation kwargs (use max_new_tokens, truncation=True)
    gen_kwargs = {
        "max_new_tokens": 60,
        "num_return_sequences": 1,
        "do_sample": True,
        "temperature": 0.8,
        "top_k": 40,
        "top_p": 0.95,
        "truncation": True
    }

    # Ensure pad_token_id is present in kwargs if tokenizer exposes eos_token_id
    tokenizer = getattr(generator, "tokenizer", None)
    if tokenizer is not None and getattr(tokenizer, "eos_token_id", None) is not None:
        gen_kwargs["pad_token_id"] = tokenizer.eos_token_id

    try:
        out = generator(instruction, **gen_kwargs)[0]["generated_text"]
    except Exception as e:
        raise RuntimeError(f"generation_failed: {e}")

    body_candidate = out.strip()
    # pick first sentence if it starts with Hello, otherwise fallback deterministic template
    sentences = [s.strip() for s in body_candidate.split('.') if s.strip()]
    if sentences and sentences[0].startswith("Hello,"):
        body = sentences[0] + '.'
    else:
        # safe fallback using a short deterministic phrasing
        example_phrase = None
        if "Begin with 'Hello,'" in instruction:
            for marker in ["like", "e.g.", "for example", "such as"]:
                if marker in instruction:
                    try:
                        example_phrase = instruction.split(marker, 1)[1].split('.')[0].strip()
                        break
                    except Exception:
                        example_phrase = None
        if example_phrase:
            body = ensure_hello(f"{example_phrase} {clean_alert}")
        else:
            body = ensure_hello(f"This is an update about {clean_alert}.")

    return {
        "recipient_email": make_recipient(student_name),
        "subject": f"Update on {student_name}",
        "body": body,
        "tone": tone,
        "metadata": {
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "student_name": student_name,
            "alert_summary": clean_alert,
            "generator": "distilgpt2-template-v2"
        }
    }

def main():
    inp = safe_load_arg()
    student_name = inp.get("student_name", "Student")
    alert_message = inp.get("alert_message", "No alert provided")
    tone = inp.get("tone", "informative")

    try:
        generator = make_generator()
    except Exception as e:
        err = {"error": "model_load_failed", "detail": str(e)}
        print(json.dumps(err))
        sys.exit(1)

    try:
        msg = build_message_from_model(student_name, alert_message, tone, generator)
        print(json.dumps(msg))
    except Exception as e:
        tb = traceback.format_exc()
        err = {"error": "generation_exception", "detail": str(e), "trace": tb}
        print(json.dumps(err))
        sys.exit(1)

if __name__ == "__main__":
    main()
