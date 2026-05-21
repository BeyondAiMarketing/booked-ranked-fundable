# BRF NVIDIA-First ICP Architecture (MVP Spec)

This document translates the BRF NVIDIA-first requirements into an implementation-ready specification for this repository.

## Locked Architecture Constraints

- Backend persistence remains fully ICP-native (Motoko canister stable storage).
- No external cloud backend/state layer is introduced.
- External AI providers are used strictly for inference/embedding/reranking calls.
- Provider secrets are stored server-side only in stable storage, never returned to frontend.
- Every provider key save path must perform a live connectivity ping before persisting.

## Phase 1: AI Model Router (Backend Core)

Create a dedicated router module in backend state with stable storage records for provider configs and task routing.

### ProviderConfig fields

- `provider_name`
- `base_url`
- `api_key_secret_name`
- `default_chat_model`
- `default_embedding_model`
- `default_reranking_model`
- `supports_chat`
- `supports_embeddings`
- `supports_reranking`
- `supports_vision`
- `supports_image_generation`
- `is_active`
- `last_ping_status`
- `last_ping_timestamp`

### Router task categories

- `general_chat`
- `rag_answer`
- `sales_copy`
- `website_audit`
- `funding_analysis`
- `seo_recommendation`
- `proposal_generation`
- `follow_up_email`
- `summarization`
- `code_generation`
- `vision_analysis`
- `document_extraction`
- `reranking`

### Default active provider

NVIDIA NIM:

- Base URL: `https://integrate.api.nvidia.com/v1`
- Chat model: `nvidia/llama-3.1-nemotron-ultra-253b-v1`
- Embedding model: `nvidia/nv-embedqa-e5-v5`
- Reranking model: `nvidia/nv-rerankqa-mistral-4b-v3`
- Secret name: `NVIDIA_API_KEY`

## Phase 2: NVIDIA-first RAG Knowledge Brain

### Ingestion flow

1. Upload file + selected collection.
2. Persist document metadata.
3. Extract text:
   - PDFs: NVIDIA vision extraction path.
   - Other text docs: plain text extraction path.
4. Chunk at 512 tokens with 50-token overlap.
5. Generate embeddings using NVIDIA embedding model.
6. Persist chunk + vector + metadata in stable storage.
7. Persist workflow log entry.

### Query flow

1. Embed user question with same embedding model.
2. Run cosine similarity on stored vectors.
3. Keep top 20 candidates.
4. NVIDIA rerank top 20 candidates.
5. Keep top 5 reranked chunks.
6. Compose answer request with strict citation schema.
7. Return answer + citations (`document_name`, `chunk_ref`).
8. Persist query log (role, collection, model, latency, success/fail).

### Collections

- `brf_sales_scripts`
- `brf_pricing`
- `brf_onboarding`
- `brf_seo_playbooks`
- `brf_funding_playbooks`
- `brf_roofing_templates`
- `brf_medspa_templates`
- `brf_hvac_templates`
- `brf_contractor_templates`
- `client_contracts`
- `client_audits`
- `client_reports`
- `call_transcripts`
- `proposals`
- `general` (default catch-all)

## Phase 3: NVIDIA Agent Workflow Nodes

Expose the following as callable workflow nodes (stored/logged in canister state):

1. PDF/Document Extraction
2. Multimodal Vision Analysis
3. RAG Answering
4. Summarization
5. Proposal Generation
6. Follow-Up Email Generation
7. SEO + Reputation Audit
8. Funding Readiness Analysis

## Phase 4: Admin Screens

1. AI Provider Settings
2. Model Router Settings
3. Collection Manager
4. Document Upload + Extraction
5. Vector Index Status
6. RAG Chat Tester
7. Agent Workflow Runner
8. Usage Logs
9. Error Logs
10. Client Manager

## Phase 5: Client Screens

1. Ask AI (general)
2. Ask AI About My Business (client-scoped RAG)
3. Reports
4. Recommendations
5. Uploaded Documents
6. Conversation History

## Phase 6: Workflow Automations (MVP minimum = 3)

Priority automations for MVP launch:

1. Document upload -> summarize -> CRM note.
2. Client intake -> proposal draft.
3. Call transcript -> follow-up email draft.

Additional automations:

- Funding checklist -> readiness score + 90-day plan.
- Website URL -> SEO/reputation action plan.
- Lead Lake -> website summarization enrichment.
- Job-site image -> vision description + estimate draft.

## Operational Rules

- Knowledge Brain mode answers only from retrieved docs.
- Always return citations.
- If context is insufficient, respond with an explicit insufficiency message.
- Never produce guaranteed funding/credit/ranking/revenue claims.

## Go Live Dashboard Changes

Add NVIDIA panel with:

- API key input.
- Live ping test.
- Connection status.
- Selected active models.
- Total embeddings stored.
- Total AI calls today.
- Explicit missing-key prompt.

## Dispatch Decision

This is dispatch-ready as an implementation blueprint. Recommended sequencing for engineering execution:

1. Backend router + provider storage.
2. NVIDIA ping + dashboard panel.
3. RAG ingest/query backbone.
4. Admin controls + logs.
5. Three MVP automations.
6. Client surfaces.
7. Remaining agent workflows.

