"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import profileStyle from "@/styles/profile.module.css";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="sub-container">
      {user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="Profile Picture"
          width={80}
          height={80}
          className={profileStyle["profile-pic"]}
        />
      )}
      <div className={profileStyle["profile-info"]}>
        <h3>{user?.username}</h3>
        <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
      </div>
    </div>
  );
}
