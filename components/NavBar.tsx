import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  HomeIcon,
  PersonIcon,
  AvatarIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseClient";

export default function Navbar() {
  const address = useAddress();

  useEffect(() => {
    if (address && db) {
      const checkOrCreateUser = async () => {
        const userRef = doc(db, 'users', address);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          console.log("User exists:", userSnap.data());
        } else {
          const newUser = {
            userAddress: address,
            coinBalance: 100,
            timeStamp: new Date().toISOString(),
            profileImg: null,
            userName: null,
          };
          await setDoc(userRef, newUser);
          console.log("New user created");
        }
      };
  
      checkOrCreateUser();
    }
  }, [address, db]);
  

  return (
    <div className="flex justify-between items-center p-4 fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-900">
      <Link href="/">
        <div className="flex flex-col justify-between items-center cursor-pointer">
          <HomeIcon className="w-12 h-12 text-foreground dark:text-white" />
          <p className="text-xs text-center text-foreground dark:text-white">
            Home
          </p>
        </div>
      </Link>
      <Link href="/games">
        <div className="flex flex-col justify-between items-center cursor-pointer">
          <VideoIcon className="w-12 h-12 text-foreground dark:text-white" />
          <p className="text-xs text-center text-foreground dark:text-white">
            Games
          </p>
        </div>
      </Link>
      <div className="cursor-pointer flex flex-col justify-between items-center">
        {!address ? (
          <div className="flex flex-col justify-between items-center">
            <div
              style={{
                width: "46px",
                height: "50px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transform: "scale(1.2)",
                  borderRadius: "50% !important",
                }}
              >
                <PersonIcon className="-z-50 w-12 h-12 text-foreground dark:text-white absolute bottom-0" />
                <ConnectWallet
                  btnTitle=". . ."
                  className=" bg-transparent dark:bg-transparent text-primary-foreground dark:text-secondary-foreground"
                />
              </div>
            </div>
            <p className="text-xs text-center text-foreground dark:text-white">
              Login
            </p>
          </div>
        ) : (
          <ConnectWallet
            btnTitle="Profile"
            className="w-12 h-12 rounded-full bg-primary dark:bg-secondary text-primary-foreground dark:text-secondary-foreground"
            detailsBtn={() => (
              <div className="flex flex-col justify-between items-center">
                <AvatarIcon className="w-12 h-12 text-foreground dark:text-white" />
                <p className="text-xs text-center text-foreground dark:text-white">
                  Profile
                </p>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
