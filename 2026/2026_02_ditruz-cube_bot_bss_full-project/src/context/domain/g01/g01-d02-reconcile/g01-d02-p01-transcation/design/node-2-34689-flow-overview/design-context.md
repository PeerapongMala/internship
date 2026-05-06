# Design Context: Flow Overview - Reconciliation Transaction

**Figma Node ID:** `2:34689`
**Node Name:** Flow Overview
**Type:** WEB_PAGE_OR_APP_SCREEN (very large node - 887KB+ metadata)

> Note: This node is extremely large (887KB+ XML metadata). Full `get_design_context` was skipped.
> Only `get_variable_defs` was fetched. The metadata XML was too large even for `get_metadata` (1,009,742 chars).
> An existing `metadata.xml` file exists at the flow-overview design folder.

## Overview

This is the flow overview node that contains the complete UX flow for the Reconciliation Transaction
feature. It likely contains multiple screen variants, flow arrows, annotations, and all states
of the reconciliation workflow.

## Variables

See `variables.json` for the complete set of design tokens used in this flow. Key additions
compared to the individual variant nodes include:

- **Theme/Border**: `#DEE2E6`
- **Heading/H4**: Pridi Medium 24px
- **Heading/H5**: Pridi Medium 20px
- **Body/Regular**: Pridi Regular 16px, lineHeight 1.5
- **Body**: Pridi Regular 14px, lineHeight 18
- **Theme/Success**: `#198754`
- **Theme Colors/Secondary**: `#6c757d`
- **Orange/600**: `#CA6510`
- **Orange/500**: `#FD7E14`
- **Components/Input/Focus Border**: `#86B7FE`
- **Focus Ring/Default**: DROP_SHADOW effect with `#0D6EFD40`

## Related Variant Nodes

The individual screen variants from this flow have been captured separately:

1. **Main Layout (Unfit)** - Node `32:25438` - Base layout without CC filters
2. **Unsort CC** - Node `2:36001` - With denomination/shift filter dropdowns
3. **CA Member** - Node `2:36565` - Member variant with CC filters
4. **CA Non-Member** - Node `2:37129` - Non-member variant with CC filters

## Existing Metadata

The full metadata XML for this node has been previously saved to:
`/workspaces/project/src/context/domain/g01/g01-d02-reconcile/g01-d02-p01-transcation/design/node-2-34689-flow-overview/metadata.xml`
