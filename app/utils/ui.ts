export function errorMessage(error: unknown) {
  const e = error as {
    data?: { statusMessage?: string; message?: string }
    statusMessage?: string
    message?: string
  }
  return (
    e?.data?.statusMessage ||
    e?.data?.message ||
    e?.statusMessage ||
    e?.message ||
    'Une erreur est survenue'
  )
}
