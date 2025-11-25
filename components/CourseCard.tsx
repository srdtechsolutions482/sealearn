import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-border-color">
      <div className="relative">
        <img 
          src={course.imageUrl || `https://placehold.co/600x400?text=${course.title.split(' ').join('+')}`} 
          alt={course.title} 
          className="w-full h-40 object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors leading-tight h-14">{course.title}</h3>
        <p className="text-sm text-text-secondary mt-1">{course.instituteName}</p>
      </div>
    </Link>
  );
};

export default CourseCard;