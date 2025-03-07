export interface EditAuthorForm {
  firstName: string
  lastName: string
}
export interface EditPostForm {
  title: string
  content: string
  postedAt: Date
  authorId: number
}

export {}
