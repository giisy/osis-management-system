# Database Schema

## User
| Field     | Type     | Keterangan                          |
|-----------|----------|--------------------------------------|
| id        | String   | UUID, primary key                    |
| name      | String   |                                       |
| email     | String   | Unique                               |
| password  | String   | Hasil hash bcrypt (bukan plain text)|
| role      | Enum     | SUPER_ADMIN, ADMIN, KETUA, ANGGOTA  |
| createdAt | DateTime | Auto                                  |
| updatedAt | DateTime | Auto                                  |