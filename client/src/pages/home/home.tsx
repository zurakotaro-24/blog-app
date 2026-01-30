import { useEffect } from "react";
import Header from "../../components/header/header"
import { useGetBlogsQuery } from "../../features/api/apiSlice";

export default function Home() {
    const { data, error, isLoading } = useGetBlogsQuery(null);
    useEffect(() => {
        if(data) {
            console.log(data);
        }
    }, [data]);

    return (
        <div className="page">
            <Header />
            {isLoading && (
                <>
                    <p>Loading</p>
                </>
            )}
            <div className="content">
                
            </div>
        </div>
    );
}