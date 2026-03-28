# Traces & Spans: Observability Basics You Should Know

**Source:** https://last9.io/blog/traces-spans-observability-basics/

## Understanding the Fundamentals

**Traces** document a request's complete journey through a distributed system, while **spans** represent individual units of work within that journey. A trace contains multiple spans where each span represents one operation with timing data and metadata.

The hierarchical relationship between these components becomes clear through their structure:

```
Trace
├── Span (API Gateway)
│   ├── Span (Auth Service)
│   └── Span (User Service)
│       └── Span (Database Query)
└── Span (Response Formatting)
```

## Key Benefits for DevOps Teams

Tracing enables organizations to:

- Identify performance bottlenecks with precision
- Debug issues across service boundaries
- Map service dependencies visually
- Accelerate mean time to recovery (MTTR)

## Technical Implementation

### Context Propagation

Requests receive unique trace IDs that travel between services, typically via HTTP headers. This allows different services to link their spans to the same trace.

### Span Components

Spans include names, timing data, status indicators, custom attributes, events, and links to other spans. These elements provide rich context for troubleshooting.

### Sampling Strategies

To manage data volume, systems employ sampling approaches:

- Head-based sampling (initial decision)
- Tail-based sampling (post-completion decision)
- Priority sampling (weighted by importance)

## OpenTelemetry as the Standard

OpenTelemetry provides vendor-neutral API and SDK along with automatic instrumentation for popular frameworks, establishing itself as the industry standard for trace implementation.

## Real-World Patterns

**Effective approaches** include meaningful span naming, appropriate granularity, proper context propagation, and useful attributes. Conversely, over-instrumentation, missing context, and inconsistent naming represent common pitfalls to avoid.

## Business Value Beyond Debugging

Tracing enables tracking of critical user journeys, measurement of key operations, and establishing Service Level Objectives based on real data—bridging technical improvements with business outcomes.
