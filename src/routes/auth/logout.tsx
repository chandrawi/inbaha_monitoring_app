import { useNavigate } from "@solidjs/router";
import { user_logout } from "bbthings_grpc/auth";
import { authServer, resourceServer, userId, setUserId } from "~/lib/store";

export default function Logout() {
  const navigate = useNavigate();

  // logout using user_id and auth_token then delete saved tokens and user id
  user_logout(authServer.get()!, {
    user_id: userId()!,
    auth_token: authServer.get()!.auth_token
  }).then(() => {
    authServer.unsetToken();
    for (const api_id of resourceServer.getApiIds()) {
      resourceServer.unsetToken(api_id);
    }
    setUserId(null);
    navigate("/auth/login", {replace:true});
  }).catch((error) => {
    console.error(error);
    setUserId(null);
    navigate("/auth/login", {replace:true});
  });

  return (<></>);
}
