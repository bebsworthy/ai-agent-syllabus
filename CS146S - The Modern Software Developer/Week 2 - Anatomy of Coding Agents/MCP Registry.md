# Introducing the MCP Registry

<!-- Source: https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/ -->

**Published:** September 8, 2025
**Authors:** David Soria Parra (Lead Maintainer), Adam Jones (Registry Maintainer), Tadas Antanavicius (Registry Maintainer), Toby Padilla (Registry Maintainer), Theodora Chu (MCP PM at Anthropic)

## Overview

Anthropic and collaborators have launched the Model Context Protocol (MCP) Registry in preview—an open catalog and API for publicly available MCP servers. The initiative standardizes server distribution and discovery across the ecosystem, providing a centralized platform for the growing MCP ecosystem.

## Single Source of Truth for MCP Servers

The registry launched at https://registry.modelcontextprotocol.io as the official hub. As an open-source project with a published OpenAPI specification, it enables compatible sub-registries.

The goal centers on providing "a primary source of truth that sub-registries can build upon," creating a unified discovery and distribution mechanism for MCP implementations across the community.

## Public and Private Sub-Registries

Organizations can create custom sub-registries based on their needs:

### Public Registries

Public marketplaces associated with MCP clients may "augment and enhance data" from the upstream registry. This allows client providers to curate and extend the central registry with additional information or filtering relevant to their users.

### Private Registries

Private registries within enterprises can build upon the central registry while maintaining security controls. Organizations can leverage the standard registry data while implementing their own governance, approval processes, and internal policies.

The registry serves as "the centralized location where MCP server maintainers publish and maintain their self-reported information."

## Community-Driven Moderation

The registry features community oversight mechanisms. Members can flag servers violating moderation guidelines—including spam, malicious code, or impersonation—for potential removal.

This collaborative approach helps maintain registry quality and security while preventing abuse of the platform.

## Getting Started

- **Server maintainers** can add entries via official documentation
- **Client maintainers** can access server data through provided guides

The preview phase remains subject to breaking changes before general availability, allowing the community to provide feedback and influence the final specification.

## Project Origins and Community

The project grew from grassroots collaboration beginning February 2025, involving contributors from nine companies including GitHub, Block, Anthropic, and Microsoft. This diverse participation reflects the broad adoption of the Model Context Protocol across the development community.