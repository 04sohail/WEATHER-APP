class APIService {
    API_URL: string = "http://localhost:3000";
    API_URL_USERS: string = "http://localhost:3000/users"
    LOADING_SCREEN: HTMLElement = document.querySelector(".fullScreen") as HTMLElement;
    // GETTING USERS FROM API //
    async GetUser(endPoint: string): Promise<User | undefined> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(`${this.API_URL}/${endPoint}`);
            if (API_response.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
            const users: User = await API_response.json();
            return users;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };
    async GetSingleUser(endPoint: string): Promise<Object[] | undefined> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(`${this.API_URL_USERS}?${endPoint}`);
            if (API_response.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
            const user: Object[] = await API_response.json();
            return user;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };
    // POSTING USER TO API 
    async PostUser(user: User, endPoint: string | null): Promise<void> {
        try {
            console.log("INSIDE POST USER");
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE: Response = await fetch(`${this.API_URL}/${endPoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
    // PATCHING USER TO API //
    async PatchUser(user: User, endPoint: string) {
        console.log(user);
        try {
            debugger
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE = await fetch(`${this.API_URL_USERS}/${endPoint}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
    // PATCHING CUSTOMER TO API //
    async CustomerPatchUser(user: User, endPoint: string) {
        console.log(user);
        try {
            debugger
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE = await fetch(`${this.API_URL_USERS}/${endPoint}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
                sessionStorage.clear()
                sessionStorage.setItem("loggedInCustomer", JSON.stringify(user));
            }
        } catch (error) {
            console.error(error);
        }
    };
    // DELETING USER FROM API //
    async DeleteUser(endPoint: string) {
        console.log(endPoint);
        debugger;
        try {
            this.LOADING_SCREEN.style.display = "block";
            console.log(this.API_URL_USERS, endPoint);

            debugger
            const API_RESPONSE = await fetch(`${this.API_URL_USERS}/${endPoint}`, {
                method: "DELETE",
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
}