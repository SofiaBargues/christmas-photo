export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
  maxDuration: 30, // 30 seconds timeout for image processing
}

export const runtime = 'nodejs'