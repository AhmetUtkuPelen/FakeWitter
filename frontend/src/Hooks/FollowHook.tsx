import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";



const FollowHook = () => {

    const QueryClientToFollow = useQueryClient();

    const {mutate:followUser,isPending} = useMutation({
        mutationFn : async (userId:string) => {

            try {

                const response = await fetch(`import.meta.env.VITE_BACKEND_URL}/api/user/followUser/${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });
    
                const data = await response.json();
    
                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong Following User !");
                }
                
                return data;
            
            } catch (error) {
                if(error instanceof Error){
                    toast.error(error.message);
                }    
            }

        },
        onSuccess : () => {
            Promise.all([
                QueryClientToFollow.invalidateQueries({queryKey : ["suggestedUsers"]}),
                QueryClientToFollow.invalidateQueries({queryKey : ["authenticatedUser"]})
            ]);
        },
        onError : () => {
            toast.error("Something Went Wrong Following User !");
        }
    });

    return {followUser,isPending};

}

export default FollowHook
