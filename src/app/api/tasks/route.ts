export async function GET() {
  const data = {
    tasks: [
      { id: 1, name: 'Task 1', completed: false },
      { id: 2, name: 'Task 2', completed: true },
      { id: 3, name: 'Task 3', completed: false },
    ],
  }

  return Response.json({ data })
}