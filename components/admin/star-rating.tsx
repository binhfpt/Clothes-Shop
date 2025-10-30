import { Star } from "lucide-react"

export const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1 ml-2 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={18}
                    className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
        </div>
    )
}
