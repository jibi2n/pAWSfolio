export type Status = 'live' | 'in-progress' | 'archived'
export type SortMode = 'newest' | 'bumped'

// ─── Stored shapes (data/db.json) ─────────────────────────────────────────────

export interface User {
  id: string
  name: string
  handle: string
  email: string
  password: string // ponytail: plaintext for the MVP (noted on the login page). Hash with node:crypto scrypt later.
  avatarColor: string
}

export interface Session {
  token: string
  userId: string
  expiresAt: number
}

export interface CommentRecord {
  id: string
  authorId: string
  text: string
  createdAt: string
}

export interface BuildRecord {
  id: string
  authorId: string
  title: string
  description: string
  imageUrl: string
  link?: string
  status: Status
  tags: string[]
  createdAt: string
  bumpedBy: string[]
  comments: CommentRecord[]
}

export interface Db {
  users: User[]
  sessions: Session[]
  builds: BuildRecord[]
}

// ─── View shapes (what components render) ─────────────────────────────────────

export type PublicUser = Pick<User, 'id' | 'name' | 'handle' | 'avatarColor'>

export interface Comment {
  id: string
  authorId: string
  author: string
  handle: string
  avatarColor: string
  timeAgo: string
  text: string
}

export interface Build {
  id: string
  title: string
  description: string
  imageUrl: string
  link?: string
  status: Status
  tags: string[]
  authorId: string
  author: string
  handle: string
  avatarColor: string
  postedAt: string
  timeAgo: string
  bumps: number
  bumped: boolean
  comments: Comment[]
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const ALL_TAGS = ['Lambda', 'S3', 'EC2', 'Bedrock', 'DynamoDB', 'Amplify', 'CloudFront', 'AppSync', 'SNS', 'SQS', 'Textract', 'EventBridge', 'SES', 'API Gateway']
export const AWS_SERVICE_TAGS = [...ALL_TAGS, 'Cognito', 'RDS', 'ECS', 'Step Functions']
