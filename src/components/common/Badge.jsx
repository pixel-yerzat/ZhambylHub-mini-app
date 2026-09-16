import React from 'react';
import { 
  Rocket, Briefcase, 
  Code2, Flame, GraduationCap, Sparkles,
  CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck
} from 'lucide-react';

/**
 * Reusable Badge component for roles, categories, and statuses
 */
export const Badge = ({ 
  variant = 'violet', 
  icon: CustomIcon, 
  children, 
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = size === 'xs' 
    ? 'text-[10px] py-0.5 px-2' 
    : 'text-[11px] py-1 px-2.5';

  return (
    <span className={`badge badge-${variant} ${sizeClasses} inline-flex items-center gap-1.5 ${className}`}>
      {CustomIcon && <CustomIcon className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
};

export const RoleBadge = ({ role, roleTitle, size = 'sm', className = '' }) => {
  switch (role) {
    case 'founder':
      return (
        <Badge variant="violet" icon={Rocket} size={size} className={className}>
          {roleTitle || 'Фаундер'}
        </Badge>
      );
    case 'investor':
      return (
        <Badge variant="amber" icon={Briefcase} size={size} className={className}>
          {roleTitle || 'Инвестор'}
        </Badge>
      );
    case 'developer':
      return (
        <Badge variant="teal" icon={Code2} size={size} className={className}>
          {roleTitle || 'Разработчик'}
        </Badge>
      );
    case 'community':
    default:
      return (
        <Badge variant="blue" icon={Sparkles} size={size} className={className}>
          {roleTitle || 'Комьюнити'}
        </Badge>
      );
  }
};

export const EventCategoryBadge = ({ categoryName, hasProjects, size = 'sm', className = '' }) => {
  const isPizza = categoryName?.toLowerCase().includes('pizza');
  if (isPizza) {
    return (
      <Badge variant="amber" icon={Flame} size={size} className={className}>
        Pizza Pitch
      </Badge>
    );
  }
  if (hasProjects) {
    return (
      <Badge variant="violet" icon={Rocket} size={size} className={className}>
        {categoryName || 'Pitch Day / Хакатон'}
      </Badge>
    );
  }
  return (
    <Badge variant="teal" icon={GraduationCap} size={size} className={className}>
      {categoryName || 'Воркшоп / Митап'}
    </Badge>
  );
};

/**
 * Gemini AI Project Verification Status Badge
 * Matches statuses from INTEGRATION_GUIDE.md:
 * - 'approved': AI Verified and approved
 * - 'rejected_duplicate': Rejected duplicate
 * - 'rejected_past_winner': Rejected past hackathon winner
 * - 'manual_review': Requires jury review
 * - 'pending': Under review
 */
export const ProjectStatusBadge = ({ status, size = 'sm', className = '' }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="teal" icon={CheckCircle2} size={size} className={className}>
          ОДОБРЕН AI
        </Badge>
      );
    case 'rejected_duplicate':
      return (
        <Badge variant="amber" icon={AlertTriangle} size={size} className={className}>
          ДУБЛИКАТ
        </Badge>
      );
    case 'rejected_past_winner':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/35 text-red-300 font-semibold font-mono uppercase ${size === 'xs' ? 'text-[9.5px] py-0.5 px-2' : 'text-[10.5px] py-1 px-2.5'} ${className}`}>
          <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span className="truncate">ПОБЕДИТЕЛЬ ХАБА</span>
        </span>
      );
    case 'manual_review':
      return (
        <Badge variant="blue" icon={Clock} size={size} className={className}>
          НА РАССМОТРЕНИИ
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="violet" icon={Sparkles} size={size} className={className}>
          ПРОВЕРКА AI
        </Badge>
      );
  }
};
