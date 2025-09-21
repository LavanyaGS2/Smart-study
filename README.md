# Smart Study Planner

A modern, responsive web application designed to help students organize their study schedules, track academic tasks, and manage study goals with visual timelines and progress tracking.

## Features

### 📊 Dashboard
- **Real-time Statistics**: View today's tasks, completed goals, study streak, and upcoming deadlines
- **Recent Activity**: Track your recent accomplishments and progress
- **Visual Overview**: Get a quick snapshot of your academic progress

### 📝 Task Management
- **Create & Edit Tasks**: Add detailed study tasks with descriptions, due dates, and priorities
- **Smart Filtering**: Filter tasks by status (All, Pending, Completed, Overdue)
- **Priority System**: Organize tasks by High, Medium, or Low priority
- **Subject Categorization**: Group tasks by subject for better organization
- **Task Completion**: Mark tasks as complete with one click

### 🎯 Goal Tracking
- **Study Goals**: Set and track long-term academic goals
- **Progress Visualization**: Visual progress bars and percentage tracking
- **Target Dates**: Set deadlines for goal achievement
- **Progress Updates**: Easily update goal progress with interactive sliders

### 📅 Timeline View
- **Weekly Calendar**: Visual timeline showing tasks for the current week
- **Navigation**: Easy week-to-week navigation
- **Task Overview**: See all tasks at a glance in calendar format
- **Quick Access**: Click on tasks in the timeline to edit them

### 💾 Data Persistence
- **Local Storage**: All data is saved locally in your browser
- **No Registration**: Start using immediately without creating an account
- **Data Security**: Your study data stays private on your device

## Technology Stack

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Responsive design with Flexbox and Grid
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons for enhanced UI
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start organizing your study schedule!

### First Time Setup
1. The application will show a "Load Sample Data" button for first-time users
2. Click it to see example tasks and goals, or start creating your own
3. Navigate between tabs to explore different features

## Usage Guide

### Adding Tasks
1. Click the "Tasks" tab
2. Click "Add Task" button
3. Fill in the task details:
   - **Title**: Brief description of the task
   - **Description**: Detailed information (optional)
   - **Due Date**: When the task needs to be completed
   - **Priority**: High, Medium, or Low
   - **Subject**: Subject or category (e.g., Mathematics, Physics)
4. Click "Save Task"

### Managing Goals
1. Click the "Goals" tab
2. Click "Add Goal" button
3. Fill in the goal details:
   - **Title**: Goal name
   - **Description**: What you want to achieve
   - **Target Date**: When you want to complete the goal
   - **Subject**: Related subject area
4. Use the progress slider to update your progress

### Using the Timeline
1. Click the "Timeline" tab
2. Navigate between weeks using Previous/Next buttons
3. View tasks scheduled for each day
4. Click on any task to edit it

### Filtering Tasks
- **All**: Show all tasks
- **Pending**: Show only incomplete tasks
- **Completed**: Show only finished tasks
- **Overdue**: Show tasks past their due date

## Features in Detail

### Responsive Design
- **Mobile Optimized**: Works perfectly on phones and tablets
- **Touch Friendly**: Large buttons and touch-optimized interface
- **Adaptive Layout**: Automatically adjusts to different screen sizes

### Visual Indicators
- **Priority Colors**: High (red), Medium (orange), Low (green)
- **Overdue Tasks**: Red border and background highlight
- **Completed Tasks**: Green background and strikethrough text
- **Progress Bars**: Visual representation of goal completion

### Data Management
- **Automatic Saving**: Changes are saved immediately
- **Data Export**: All data stored in browser's local storage
- **No Data Loss**: Information persists between browser sessions

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## File Structure

```
Smart Study/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## Customization

### Adding New Features
The modular JavaScript structure makes it easy to add new features:
- Add new task properties in the `handleTaskSubmit` method
- Create new filters in the `filterTasks` method
- Add new dashboard statistics in the `updateDashboard` method

### Styling
The CSS uses CSS custom properties and modern layout techniques:
- Modify color schemes by changing CSS variables
- Adjust spacing using the utility classes
- Add new animations using CSS transitions

## Troubleshooting

### Data Not Saving
- Ensure JavaScript is enabled in your browser
- Check if local storage is available and not full
- Try refreshing the page

### Tasks Not Displaying
- Check the browser console for JavaScript errors
- Verify that the data exists in local storage
- Try clearing browser cache and reloading

### Mobile Issues
- Ensure you're using a modern mobile browser
- Check if the viewport meta tag is properly set
- Try rotating the device to landscape mode

## Future Enhancements

Potential features for future versions:
- **Cloud Sync**: Sync data across devices
- **Reminder Notifications**: Browser notifications for due tasks
- **Study Analytics**: Detailed progress reports and insights
- **Study Groups**: Collaborative features for group study
- **Export/Import**: Backup and restore data
- **Dark Mode**: Alternative color scheme
- **Study Timer**: Built-in Pomodoro timer
- **Achievement System**: Gamification elements

## Contributing

This is a standalone project, but suggestions and improvements are welcome:
1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure you're using a supported browser version

---

**Happy Studying! 📚✨**

*Smart Study Planner - Organize, Track, Achieve*
