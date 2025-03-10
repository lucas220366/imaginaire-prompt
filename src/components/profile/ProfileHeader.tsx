
import { useNavigate } from "react-router-dom";
import NavigationMenu from "@/components/layout/NavigationMenu";

interface ProfileHeaderProps {
  onSignOut: () => Promise<void>;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow">
          {/* Title section remains visible on all screen sizes */}
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
            <p className="text-gray-600 mt-2">
              View and download all your previously generated images
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end ml-4">
          <NavigationMenu 
            isAuthenticated={true} 
            onSignOut={onSignOut} 
            showBackToGenerator={true}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
