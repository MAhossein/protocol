import {getServerSession} from "next-auth/next";

export default async function AuthStatus() {
  const session = await getServerSession();
  return (
    <div className="">
      {session && (
          <div>
            <div className={"username"}>{session.user?.name}</div>
            <span className={"text-text-light useremail"}>
              {session.user?.email}
            </span>
          </div>
      )}

      {!session && (
          <p className="text-stone-200 text-sm">
            You are not signed in
          </p>
      )}
    </div>
  );
}
