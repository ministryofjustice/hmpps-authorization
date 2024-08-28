import fetch from 'node-fetch'
import chalk from 'chalk'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

const packageName = path.basename(process.cwd())

async function getTemplatePackageJson() {
  const response = await fetch('https://raw.githubusercontent.com/ministryofjustice/hmpps-template-typescript/main/package.json')
  return await response.json()
}

async function getHelmValues() {
  const response = await fetch('https://raw.githubusercontent.com/ministryofjustice/hmpps-template-typescript/main/helm_deploy/hmpps-template-typescript/Chart.yaml')
  const text = await response.text()
  return yaml.load(text)
}

async function getDockerNodeVersion() {
  const response = await fetch('https://raw.githubusercontent.com/ministryofjustice/hmpps-template-typescript/main/Dockerfile')
  const text = await response.text()
  return getNodeVersion(text)
}

const getNodeVersion = (dockerFile) => {
  const line = dockerFile.split('\n').find(line => line.startsWith('FROM'))
  return line.substring("FROM node:".length, line.indexOf('-slim'))
}

let packageJson = {}
try {
  let fileContents = fs.readFileSync(`./package.json`, 'utf8')
  packageJson = JSON.parse(fileContents)
} catch (e) {
  console.error(e)
}

let helmValues = {}
try {
  let fileContents = fs.readFileSync(`./helm_deploy/${packageName}/Chart.yaml`, 'utf8')
  helmValues = yaml.load(fileContents)
} catch (e) {
  console.error(e)
}

let nodeVersion = ''
try {
  let fileContents = fs.readFileSync(`Dockerfile`, 'utf8')
  nodeVersion = getNodeVersion(fileContents)
} catch (e) {
  console.error(e)
}

getTemplatePackageJson().then(templateJson => {
  const templateDeps = {
    ...templateJson.dependencies,
    ...templateJson.devDependencies,
  }

  console.log('---------------------------------------')
  console.log('Checking for differences in shared dependencies:')
  console.log(`${packageName} => hmpps-typescript-template`)
  console.log('---------------------------------------')

  console.log('Production dependencies:')
  // check all dependencies in packageJson.dependencies to see if they are in templateDeps
  Object.keys(packageJson.dependencies).forEach(dep => {
    if(templateDeps[dep]) {
      if(packageJson.dependencies[dep] !== templateDeps[dep]) {
        console.log(chalk.red(`${dep}: ${packageJson.dependencies[dep]} => ${templateDeps[dep]}`))
      } else {
        console.log(chalk.green(`${dep}: ${packageJson.dependencies[dep]}`))
      }
    }
  })

  console.log('---------------------------------------')
  console.log('Dev dependencies:')
  Object.keys(packageJson.devDependencies).forEach(dep => {
    if(templateDeps[dep]) {
      if(packageJson.devDependencies[dep] !== templateDeps[dep]) {
        console.log(chalk.red(`${dep}: ${packageJson.devDependencies[dep]} => ${templateDeps[dep]}`))
      } else {
        console.log(chalk.green(`${dep}: ${packageJson.devDependencies[dep]}`))
      }
    }
  })

}).then(() => {

  getHelmValues().then(templateHelmValues => {

    console.log('---------------------------------------')
    console.log('Helm values:')

    const templateGenericService = templateHelmValues.dependencies[0]
    const templateGenericPrometheusAlerts = templateHelmValues.dependencies[1]

    const genericService = helmValues.dependencies[0]
    const genericPrometheusAlerts = helmValues.dependencies[1]

    if (genericService.version !== templateGenericService.version) {
      console.log(chalk.red(`generic-service: ${genericService.version} => ${templateGenericService.version}`))
    } else {
      console.log(chalk.green(`generic-service: ${genericService.version}`))
    }

    if (genericPrometheusAlerts.version !== templateGenericPrometheusAlerts.version) {
      console.log(chalk.red(`generic-prometheus-alerts: ${genericPrometheusAlerts.version} => ${templateGenericPrometheusAlerts.version}`))
    } else {
      console.log(chalk.green(`generic-prometheus-alerts: ${genericPrometheusAlerts.version}`))
    }
    console.log('---------------------------------------')
  }).then(() => {
    console.log('Dockerfile - Node version:')
    getDockerNodeVersion().then(templateNodeVersion => {
      if (templateNodeVersion !== nodeVersion) {
        console.log(chalk.red(`${nodeVersion} => ${templateNodeVersion}`))
      } else {
        console.log(chalk.green(`${nodeVersion}`))
      }
    }).then(() => {
      console.log('---------------------------------------')
      console.log('Done')
    })
  })
})
