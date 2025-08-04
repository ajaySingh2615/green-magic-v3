import { Shield, Store, User } from "lucide-react";
import { getRoleBadgeColor, getRoleIcon } from "../../utils/roleUtils";

/**
 * RoleBadge Component
 * Displays a styled badge for user roles
 */

const RoleBadge = ({ role, size = "sm", showIcon = true, className = "" }) => {
  if (!role) return null;

  const getIconComponent = (role) => {
    switch (role) {
      case "admin":
        return Shield;
      case "vendor":
        return Store;
      case "customer":
      default:
        return User;
    }
  };

  const IconComponent = getIconComponent(role);
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const sizeClasses = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2",
  };

  const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full border font-medium ${getRoleBadgeColor(
        role
      )} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <IconComponent className={iconSizeClasses[size]} />}
      <span>{roleLabel}</span>
    </span>
  );
};

export default RoleBadge;
