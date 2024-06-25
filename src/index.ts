import * as core from "@actions/core"
import { execSync } from "node:child_process"

enum BumpType {
	MAJOR = "major",
	MINOR = "minor"
}

const bumpVersion = (bumpType: BumpType, currentVersion: number): number | void => {
	core.info(`Detected BumpType: ${bumpType}`)

	if (bumpType == BumpType.MAJOR) {
		const version = currentVersion + 1

		core.info(`Bumping to Version: ${version}`)

		return version
	}

	if (bumpType == BumpType.MINOR) {
		const version = currentVersion + .1

		core.info(`Bumping to Version: ${version}`)

		return version
	}
}

const getLatestVersion = (): number => {
	core.info(`Getting latest Version`)

	const versionListCmd = execSync('git describe --tags "$(git rev-list --tags --max-count=1)"')
	let splitList = versionListCmd.toString().split("\n")
	splitList = splitList.filter(version => version)

	const latestVersion = splitList[0].substring(1, splitList[0].length)
	core.info(`Found Latest Version: ${latestVersion}`)

	return parseFloat(latestVersion)
}

async function run() {
	try {
		const isLocal = core.getInput("local_run")
		if (isLocal == "true") {
			core.info("You have run this locally to ensure it's working condition")
			core.ExitCode.Success
		} else {
			const bumpType = core.getInput("bump_type")
			const latestVersion = getLatestVersion()

			const bump = BumpType[bumpType as keyof typeof BumpType]
			const newVersion = bumpVersion(bump, latestVersion)

			execSync(`git tag -a "v${newVersion}" -m "v${newVersion}"`);
			execSync(`git push origin "v${newVersion}"`);

			core.info(`Pushed New Version: ${newVersion}`)
			core.ExitCode.Success
		}

	} catch (err) {
		core.setFailed("Failed to Create New Version")
	}
}

run()
