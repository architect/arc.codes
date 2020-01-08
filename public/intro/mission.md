# Architect's Mission

## Build Web Apps as Fast as Possible
Cloud computing has supercharged the developer experience, but we believe it can be easier. Architect saves you from typing tedious infrastructure templates and simplifies the cloud into composable services to be the most productive. 

App Primitives in Architect allow devlopers to combine the most common cloud native services to build apps.

[Learn more about App Primitives]

## Declarative Infrastructure as Code 
Architect does the heavy lifting of formatting and creating CloudFormation stacks on AWS with a lightweight Arc file that describes the resources you need to run the application in far fewer lines of code. 

[Check out this example in our Playground](https://arc.codes/playground)

You will see how declaring an app namespace and its components will output a CloudFormation stack that is many lines longer.

## Convention over Configuration
Architect is designed to manage the complexity of composing many cloud functions to operate as one distributed system. Architect lets you and your team become immediately productive by looking at a single project structure with a manifest file at the root of your application. We decrease the number of decisions that a developer has to make without necessarily losing flexibility. [Learn more about Project Structure]

## History Lesson - Someone else's computer
The most recent advancements in creating web apps involves running your code on abstractions of hardware and operating systems using services from cloud providers like AWS and Azure. Instead of purchasing or leasing physical hardware and all of the administration comes with it, developers are now empowered to use cloud services to get their job done and focus only on shipping code. Shifting away from onprem environments to the cloud enables larger scale computing and higher availability. The cloud providers turned compute resources into services. Serverless, a fast growing cloud paradigm, is enabling applications to be run in the cloud with many different benefits. Architect was orginally created to build production products and open sourced as a framework for other serverless developers. [Learn more about serverless]

The `.arc` manifest takes inspiration from UNIX 'run command' files (like `.vimrc`, `.bashrc`, etc). Architect started out as `arc` which itself was an acronym for "Amazon run commands".

The code was developed building [Begin](https://begin.com) and granted to [JS Foundation](https://js.foundation/) in July of 2017 under the `Apache-2.0` license.