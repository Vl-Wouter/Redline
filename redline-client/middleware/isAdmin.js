export default function({ store, error }) {
  const { roles } = store.state.user.current
  if (!roles.includes('ADMIN') && !roles.includes('MODERATOR')) {
    error({
      message: 'You are not authorized to view this page',
      statusCode: 401
    })
  }
}
