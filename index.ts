import * as kubernetes from "@pulumi/kubernetes";
import * as awsx from "@pulumi/awsx";

const repository = new awsx.ecr.Repository("repo");

const appName = `shihtzu-io`;

const appReplicas = 1;

const appLabels = {
    "app.kubernetes.io/name": appName
};
const appMetadata = {
    name: appName,
    labels: appLabels
};

const deployment = new kubernetes.apps.v1.Deployment(appName, {
    metadata: appMetadata,
    spec: {
        selector: {
            matchLabels: appLabels
        },
        replicas: appReplicas,
        template: {
            metadata: {
                labels: appLabels
            },
            spec: {
                containers: [
                    {
                        name: appName,
                        image: repository.buildAndPushImage("."),
                        ports: [
                            {
                                name: "http",
                                containerPort: 8080
                            }
                        ]
                    }
                ]
            }
        }
    }
});
const service = new kubernetes.core.v1.Service(appName, {
    metadata: appMetadata,
    spec: {
        type: "NodePort",
        selector: appLabels,
        ports: [
            {
                name: "http",
                port: 80,
                targetPort: deployment.spec.template.spec.containers[0].ports[0].name,
            }
        ],
    },
});

export const name = deployment.metadata.name;