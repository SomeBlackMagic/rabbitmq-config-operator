export type VhostEntity = {
    name: string
    description?: string
    tags?: string
    defaultQueueType?: "classic" | "quorum" | "stream"
}