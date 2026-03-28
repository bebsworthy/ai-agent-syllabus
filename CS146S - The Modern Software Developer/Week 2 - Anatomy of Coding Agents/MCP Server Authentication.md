# MCP Server Authentication

**Source:** https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication

## Overview

The guide covers two approaches to securing remote MCP servers deployed on Cloudflare:

**Public Access:** anyone can connect and use the server (no login required).

**Secured Access:** users sign in before accessing tools, and you can control which tools an agent can call based on the user's permissions.

## Authentication Methods

### Cloudflare Access OAuth

Organizations can leverage Cloudflare Access as their identity provider. This approach verifies user credentials through your existing identity providers (such as GitHub or Google) and enforces Access policies to determine who gains entry.

### Third-Party OAuth Providers

The platform supports any OAuth provider that supports the OAuth 2.0 specification, including GitHub, Google, Slack, Stytch, Auth0, and WorkOS.

## Implementation Example: GitHub OAuth

The documentation provides a complete workflow:

1. **Development Setup:** Create a local GitHub OAuth app pointing to `http://localhost:8788/callback`
2. **Local Testing:** Use the MCP Inspector to authenticate and verify tool access
3. **Production Deployment:** Create a second OAuth app for the live `workers.dev` domain
4. **Secret Management:** Store credentials using Wrangler CLI and configure a KV namespace for session data

The authentication flow redirects users to GitHub, where they authorize the MCP client, then receive access tokens for subsequent tool calls.
