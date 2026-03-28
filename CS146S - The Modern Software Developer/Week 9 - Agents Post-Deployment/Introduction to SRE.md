# Site Reliability Engineering: Introduction

**Source:** https://sre.google/sre-book/introduction/

## The Traditional Sysadmin Model

Historically, organizations have managed computing systems through systems administrators who assemble software components and respond to operational events. This approach has advantages—it's familiar and leverages existing tools and talent pools—but significant drawbacks emerge as systems scale.

The sysadmin model creates a structural conflict between development and operations teams. Developers prioritize feature velocity while operations teams emphasize stability. This division leads to friction over release cadence and often results in ineffective safeguards like extensive launch reviews.

## Google's SRE Approach

Google reimagined operations by hiring software engineers to build automated systems rather than maintaining manual processes. As the founding leader explains, "SRE is what happens when you ask a software engineer to design an operations team."

### Team Composition

Google's SRE teams comprise:
- **50-60%** standard software engineers
- **40-50%** candidates with near-equivalent skills plus specialized expertise (typically Unix internals or networking)

This diverse background produces creative, high-quality solutions while maintaining shared vocabulary with product developers.

### The 50% Rule

Google enforces a critical principle: SREs spend at most 50% of their time on operational work (tickets, on-call, manual tasks). The remaining 50% must focus on development work that reduces future operational burden. This ensures systems become increasingly self-managing rather than merely automated.

## Core Tenets of SRE

**Error Budgets:** Rather than pursuing 100% availability (which users can't distinguish from 99.999%), teams define realistic targets. The permitted unavailability becomes the "error budget"—spending authority for innovation and risk-taking.

**Monitoring Strategy:** Effective monitoring generates three types of output: alerts requiring immediate action, tickets for future work, and logs for diagnostic purposes. Human interpretation should never be required.

**Change Management:** Roughly 70% of outages stem from changes. Automated progressive rollouts, rapid problem detection, and safe rollbacks minimize user impact while accelerating release velocity.

**Emergency Response:** Mean time to repair (MTTR) determines availability more than failure frequency. Prepared playbooks yield approximately 3x improvements over ad-hoc responses.

**Capacity Planning:** SREs must forecast both organic growth and business-driven demand, then provision accordingly—a responsibility that requires engineering involvement in infrastructure decisions.

## Results

This engineering-first operations model yields measurable benefits: team size scales sublinearly with system size, rapid innovation becomes possible, and the dev/ops divide dissolves through cross-training opportunities.
