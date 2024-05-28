import prisma from '@/app/libs/prismadb'

export interface IListingParams {
  userId?: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
  locationValue?: string
  category?: string
}

export default async function getListings(params: IListingParams) {
  const {
    userId,
    roomCount,
    guestCount,
    bathroomCount,
    locationValue,
    startDate,
    endDate,
    category,
  } = params
  try {
    let query: any = {}

    if (userId) {
      query.userId = userId
    }
    if (category) {
      query.category = category
    }
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      }
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      }
    }
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      }
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      }
    }
    if (locationValue) {
      query.locationValue = locationValue
    }
    const listings = await prisma?.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeListings = listings?.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }))
    return safeListings
  } catch (err: any) {
    throw new Error(err)
  }
}
