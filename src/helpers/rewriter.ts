export function getRewriterStatusText(status: number) {
  switch (status) {
    case 3:
      return 'InProgress'

    case 9:
      return 'Completed'
  }

  return 'NotStarted'
}
