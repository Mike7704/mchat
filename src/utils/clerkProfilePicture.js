import clerk from "@clerk/clerk-sdk-node";

/**
 * Return Clerk profile picture for a given user ID
 * @param {string} userId - The ID of the user
 */
async function getClerkProfilePictureURL(userId) {
  try {
    const user = await clerk.users.getUser(userId);
    return user.imageUrl || null;
  } catch (err) {
    console.error(`Failed to fetch Clerk user for ${userId}`, err);
    return null;
  }
}

// Get Clerk profile image for each user
export async function getUsersWithProfilePicture(users) {
  if (!Array.isArray(users) || users.length === 0) {
    return users;
  }

  return await Promise.all(
    users.map(async (user) => ({
      ...user,
      profileImage: await getClerkProfilePictureURL(user.id),
    }))
  );
}
