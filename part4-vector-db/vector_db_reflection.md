# Vector DB — Reflection & Use Case Analysis

## Vector DB Use Case

### Scenario: Semantic Contract Search for a Law Firm

A traditional keyword-based search would not suffice for this use case, and the limitation is fundamental rather than incidental.

Keyword search operates on exact or near-exact token matching. If a lawyer asks *"What are the termination clauses?"*, a keyword engine scans for the literal string "termination" in the document. But a 500-page contract might express the same concept using entirely different language — *"dissolution of agreement"*, *"conditions for exit"*, *"right to rescind"*, or *"notice period for contract end"*. A keyword search returns nothing for these semantically equivalent phrasings, producing dangerous false negatives in a legal context where missing a relevant clause could have serious consequences.

This is precisely the problem vector databases solve. In the proposed system, the contract would first be split into overlapping chunks (paragraphs or sliding windows of sentences) during an ETL/ingestion phase. Each chunk would be passed through an embedding model — such as a legal-domain fine-tuned variant of `all-MiniLM-L6-v2` or OpenAI's `text-embedding-ada-002` — converting it into a high-dimensional vector that encodes semantic meaning rather than surface tokens.

When a lawyer types *"What are the termination clauses?"*, the query is embedded into the same vector space and the vector database (e.g., Pinecone, Weaviate, or pgvector) performs an Approximate Nearest Neighbour (ANN) search, returning the chunks whose vectors are closest to the query vector. These chunks are then passed to an LLM (Retrieval-Augmented Generation pattern) which synthesises a precise, cited answer.

The result is a system that understands *intent*, not just keywords — making it far more reliable for legal document analysis where terminology is inconsistent across jurisdictions, drafting styles, and time periods.
