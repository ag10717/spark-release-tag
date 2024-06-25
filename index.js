import * as core from "@actions/core"
import { execSync } from "node:child_process"

try {
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

	let newTag
	let bumpType = core.getInput("bump_type")
	switch (bumpType) {
		case bumpType == "major":
			newTag = largestTag + 1
		case bumpType == "minor":
			newTag = largestTag + .1
	}

	if (newTag == largestTag) {
		core.info("no new tag to create")
		core.ExitCode.Success
	}

	execSync(`git tag -a ${newTag} -m ${newTag}`)
	execSync(`git push origin ${newTag}`)

	core.info(`created new tag: ${newTag}`)
} catch (err) {
	core.setFailed(err)
}
