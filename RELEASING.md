# Automatic npm publishing

Merging to main runs .github/workflows/publish.yml. The workflow checks the latest npm release and occupied versions, selects an available stable version (normally a patch bump), builds the package, commits the version to main, publishes through npm Trusted Publishing, and records the matching v<version> Git tag. Major/minor releases can be prepared in package.json. Manual publishing remains allowed.

## One-time npm setup

In the merchi_product_form npm package settings, create a GitHub Actions Trusted Publisher with:

- Organization/user: merchisdk
- Repository: merchi_product_form
- Workflow filename: publish.yml
- Environment: leave blank
- Allow npm publish: enabled

This authorization has not been configured or verified by this PR. No NPM_TOKEN is required. GitHub branch rules must permit the workflow's normal version commit push; the workflow never changes protections or force-pushes. Main was not classically protected when this PR was prepared.

## Recovery and safeguards

The hourly scheduled run retries interrupted releases. Runs are serialized per repository and check out the latest main. Registry failures are not treated as available versions. Unknown or non-ancestor manual release sources cause a safe skip. Same-commit releases are not republished. A final registry check defers publication if another publisher has changed latest or occupied the candidate version.

After publishing, exact-version verification uses fresh reads and up to seven attempts over 30 seconds. It never repeats publication in that run. Missing tags for the latest published source are recovered on subsequent runs, even when main has advanced. Existing conflicting tags are preserved and reported as failures. Ignored untracked package-lock.json remains untracked.

Manual npm commands are outside the Actions concurrency lock. Simultaneous different-version publications can still race on latest; coordinate exceptional manual releases with active jobs. The workflow does not unpublish versions or alter consumers.

## Build and validation

The build uses npm throughout, compiles JavaScript/assets/Sass, and emits lib/index.d.ts via tsconfig.build.json. Before publishing, verify-package.mjs checks that all declared main/module/types entry points are present in the archive file list. Release scripts have 22 node:test cases. The declaration build revealed optional pricing-field arrays; selection conversion now defaults absent arrays to empty lists. The existing selections/price-matrix tests plus the regression case passed locally (14 tests).

Hosted OIDC publication can only be verified after the Trusted Publisher is configured and this workflow is merged.
