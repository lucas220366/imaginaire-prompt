
import NavigationMenu from "@/components/layout/NavigationMenu";

interface ProfileHeaderProps {
  onSignOut: () => Promise<void>;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex-grow mx-auto md:mx-0 max-w-xl md:max-w-none">
        {/* Title section remains visible on all screen sizes */}
        <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
          <p className="text-gray-600 mt-2">
            View and download all your previously generated images
          </p>
        </div>
      </div>
      
      <div className="absolute top-6 right-6 md:relative md:top-0 md:right-0 md:ml-4">
        <NavigationMenu 
          isAuthenticated={true} 
          onSignOut={onSignOut} 
          showBackToGenerator={true}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
