# Advanced Context Engineering for Coding Agents

**Source:** https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md

## Main Thesis

Today's AI coding models can effectively handle complex, large codebases through deliberate context management strategies, rather than waiting for smarter models. The author challenges the common belief that AI tools are only useful for greenfield projects.

## Key Findings

**Stanford Research Insights:** AI tools often generate rework and prove counterproductive in brownfield codebases, contradicting productivity claims.

**Practical Evidence:** The author demonstrated success working on a 300k LOC Rust project (BAML), completing bug fixes and features estimated at 3-5 days in under 7 hours using structured workflows.

## Core Technique: Frequent Intentional Compaction

The approach involves three phases:

### 1. Research

Understand codebase structure and relevant files

### 2. Plan

Outline specific implementation steps with precise testing phases

### 3. Implement

Execute the plan while maintaining 40-60% context utilization

## Critical Insights

### Context as Your Only Lever

Since LLMs are stateless functions, the input context window is the exclusive mechanism affecting output quality.

### Human Review Focus

High-leverage human attention should target research and plans rather than code review—errors compound exponentially upstream.

### Not Magical

The approach requires active engagement, deep problem-solving, and subject matter expertise. Success depends on thoughtful collaboration, not prompt engineering alone.

## Practical Limitations

The author acknowledges significant constraints: complex dependency management issues and lack of codebase expertise can derail even well-structured approaches.
