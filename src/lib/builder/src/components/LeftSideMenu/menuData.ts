import { Layout, Square, Type, Image, LineChart, Map, Shapes, Play } from 'lucide-react';

export interface Category {
  name: string;
  icon: React.ComponentType<any>;
  subItems: string[];
}

export const categories: Category[] = [
  {
    name: 'Templates',
    icon: Layout,
    subItems: ['Cover Page', 'Table of Contents', 'Chapter', 'Image Gallery', 'Video Chapter']
  },
  {
    name: 'Basic Elements',
    icon: Square,
    subItems: ['Text Block', 'Ordered List', 'Unordered List', 'Image Frame', 'Image Grid']
  },
  {
    name: 'UI Elements',
    icon: Shapes,
    subItems: ['Button', 'Card', 'Call to Action', 'Testimonial']
  },
  {
    name: 'Interactive Elements',
    icon: Play,
    subItems: ['QR Code', 'Embedded Video', 'GIF', 'Checklist']
  },
  {
    name: 'Charts',
    icon: LineChart,
    subItems: ['Bar Chart', 'Line Chart', 'Pie Chart']
  },
  {
    name: 'Maps',
    icon: Map,
    subItems: ['World Map', 'Country Map', 'City Map']
  }
];

export const textCategory: Category = {
  name: 'Text',
  icon: Type,
  subItems: []
};