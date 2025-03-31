"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import profileStyle from "@/styles/profile.module.css";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className={profileStyle.container}>
      {user?.imageUrl && (
        <Image src={user.imageUrl} alt="Profile Picture" width={100} height={100} className="profile-pic" />
      )}
      <h3>Username: {user?.username}</h3>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
