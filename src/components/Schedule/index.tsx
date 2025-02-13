import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fa";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

dayjs.locale("fa");

const baseHours = Array.from({ length: 10 }, (_, i) => 8 + i);


const days = Array.from({ length: 7 }, (_, i) =>
    dayjs().add(i, "day").format("dddd")
);

type Post = {
    id: number;
    title: string;
    date: string;
    time: string;
};

const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 20);
};

const Schedule: React.FC = () => {
    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
        select: (data) => {
            return data.map((post: any, index: number) => {
                const randomDay = index % 7;
                const randomHour = 8 + (index % 10);
                return {
                    id: post.id,
                    title: post.title,
                    date: dayjs().add(randomDay, "day").tz("Asia/Tehran").format("YYYY-MM-DD"),
                    time: `${randomHour}:00`,
                };
            });
        },
    });

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const hours = sortOrder === "asc" ? baseHours : [...baseHours].reverse();

    if (isLoading) return <div>درحال بارگذاری</div>;
    if (error) return <div>مشکلی پیش آمده</div>;

    return (
        <div className="overflow-x-auto p-4">
            <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="mb-4 p-2 bg-blue-500 text-white rounded  cursor-pointer"
            >
                مرتب‌سازی ساعت: {sortOrder === "asc" ? "🔼 صعودی" : "🔽 نزولی"}
            </button>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-2 border-gray-300  p-2">زمان</th>
                        {days.map((day) => (
                            <th key={day} className="border-2 border-gray-300 p-2">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hours.map((hour) => (
                        <tr key={hour}>
                            <td className="border-2 border-gray-300  p-2">
                                {dayjs().hour(hour).minute(0).format("HH:mm")}
                            </td>
                            {days.map((day) => {
                                const post = posts?.find(
                                    (p) =>
                                        p.time === `${hour}:00` &&
                                        dayjs(p.date).format("dddd") === day
                                );
                                return (
                                    <td key={day} className="border-2 border-gray-300  p-2">{post ? post.title : ""}</td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Schedule;
