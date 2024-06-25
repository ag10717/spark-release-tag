import * as core from "@actions/core"
import { execSync } from "node:child_process"

try {
	// set a committer for testing
	execSync(`git config user.name "Alex Girardi"`)
	execSync(`git config user.email "alex.girardi@rac.com.au"`)

	core.info(process.cwd())
	const tagListCmd = execSync("git tag -l")

	let tagList = tagListCmd.toString().split("\n")
	tagList = tagList.filter(tag => tag)

	// find latest
	const subbedList = tagList.map(tag => tag.substring(1, tag.length))

	let largestTag = 0.0
	for (const subbed of subbedList) {
		const numberSubbed = parseFloat(subbed)
		if (numberSubbed >= largestTag) {
			largestTag = subbed
		}
	}

	core.info(`found largestTag: ${largestTag}`)

	let newTag
	let bumpType = core.getInput("bump_type")
	core.info(`got bumpType: ${bumpType}`)

	switch (bumpType) {
		case "major":
			newTag = largestTag + 1
		case "minor":
			newTag = largestTag + .1
	}

	core.info(`using new tag: ${newTag}`)

	if (newTag == largestTag) {
		core.info("no new tag to create")
		core.ExitCode.Success
	} else {
		execSync(`git tag -a "v${newTag}" -m "v${newTag}"`)
		execSync(`git push origin "v${newTag}"`)

		core.info(`created new tag: ${newTag}`)
	}
} catch (err) {
	core.setFailed(err)
}
