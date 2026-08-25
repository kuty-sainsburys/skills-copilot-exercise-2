import mongoose from 'mongoose'
import { Activity, Leaderboard, Team, User, Workout } from '../models.js'

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db'

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString)

    console.log('Connected to octofit_db')

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ])

    const users = await User.create([
      { username: 'alex', email: 'alex@example.com' },
      { username: 'casey', email: 'casey@example.com' },
      { username: 'jordan', email: 'jordan@example.com' },
      { username: 'taylor', email: 'taylor@example.com' },
    ])

    const teams = await Team.create([
      { name: 'Trailblazers', members: [users[0]._id, users[1]._id] },
      { name: 'Peak Performers', members: [users[2]._id, users[3]._id] },
    ])

    await User.bulkWrite([
      { updateOne: { filter: { _id: users[0]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[1]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[2]._id }, update: { teamId: teams[1]._id } } },
      { updateOne: { filter: { _id: users[3]._id }, update: { teamId: teams[1]._id } } },
    ])

    const activities = await Activity.create([
      { userId: users[0]._id, type: 'Running', durationMinutes: 35, points: 80 },
      { userId: users[1]._id, type: 'Cycling', durationMinutes: 45, points: 95 },
      { userId: users[2]._id, type: 'Strength', durationMinutes: 30, points: 70 },
      { userId: users[3]._id, type: 'Yoga', durationMinutes: 25, points: 55 },
    ])

    await Leaderboard.create(
      users
        .map((user) => ({
          userId: user._id,
          teamId: teams.find((team) => team.members.some((member) => member.equals(user._id)))?._id,
          points: activities
            .filter((activity) => activity.userId.equals(user._id))
            .reduce((total, activity) => total + activity.points, 0),
        }))
        .sort((left, right) => right.points - left.points)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    )

    await Workout.create([
      {
        name: 'Full Body Foundation',
        description: 'A balanced circuit for building strength and mobility.',
        difficulty: 'Beginner',
        durationMinutes: 30,
      },
      {
        name: 'Cardio Intervals',
        description: 'Short running intervals to improve cardiovascular fitness.',
        difficulty: 'Intermediate',
        durationMinutes: 25,
      },
      {
        name: 'Recovery Flow',
        description: 'Gentle stretches and breathing for active recovery.',
        difficulty: 'Beginner',
        durationMinutes: 20,
      },
    ])

    console.log('Database seeding complete')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()
