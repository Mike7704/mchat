// Fetch a user's profile picture
export async function fetchProfilePicture(userId) {
  try {
    const res = await fetch(`/api/profile-picture?userId=${userId}`);
    const data = await res.json();
    return data.imageUrl || "/default-avatar.png";
  } catch (err) {
    console.error("Error fetching profile image:", err);
    return "/default-avatar.png";
  }
}
