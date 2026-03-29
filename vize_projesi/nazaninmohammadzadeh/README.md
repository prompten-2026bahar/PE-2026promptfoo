# Promptfoo Django Q&A Evaluation

This project benchmarks multiple local LLMs on Django framework questions using Promptfoo.

It compares answer quality across several Ollama-hosted models and evaluates outputs with a mix of deterministic assertions and an LLM-as-a-judge rubric powered by Gemini.

## Overview

- Prompt orchestration and evaluation: Promptfoo
- Answer generation models: Ollama
- Grading model for `llm-rubric`: Gemini
- Evaluation domain: Django Q&A

## Models Under Test

The project currently evaluates these local Ollama models:

- `llama3.2`
- `mistral`
- `gemma2:2b`
- `phi3:mini`

## Evaluation Strategy

Each Django question is sent to all configured Ollama models.

The generated responses are then evaluated with:

- Deterministic assertions such as `icontains` or `icontains-any`
- Model-assisted assertions such as `llm-rubric`

This allows the project to measure both:

- Surface-level signal, such as whether expected technical terminology appears
- Semantic quality, such as whether the answer actually explains the concept correctly

## Project Structure

- `promptfooconfig.yaml` - Main Promptfoo evaluation configuration
- `prompts/django_qa.txt` - The prompt template used for all questions
- `sunum_notlari.md` - Presentation notes and explanation of the evaluation flow
- `requirements.txt` - Setup prerequisites and startup steps

## Prerequisites

See [requirements.txt](requirements.txt) for the full setup checklist.

At a minimum, you need:

- Node.js 18+
- npm
- Ollama installed and running locally
- The required Ollama models pulled locally
- A valid `GOOGLE_API_KEY` in `.env`

## Installation

Install project dependencies:

```bash
npm install
```

Pull the required Ollama models:

```bash
ollama pull llama3.2
ollama pull mistral
ollama pull gemma2:2b
ollama pull phi3:mini
```

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_key_here
```

## Usage

Run the evaluation:

```bash
npm run eval
```

Open the Promptfoo results viewer:

```bash
npm run view
```

## Notes

- Local model answers are produced through Ollama.
- The `llm-rubric` assertion is graded through Gemini.
- Gemini free-tier limits may cause HTTP `429` quota/rate-limit errors during larger eval runs.
- If that happens, retry later or reduce concurrency.

## Suggested Repository Description

Promptfoo-based Django Q&A benchmark comparing local Ollama models with Gemini rubric grading.