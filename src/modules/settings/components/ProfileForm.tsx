import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, MenuItem, Paper, Alert, Snackbar,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import { selectSettings, updatePreferences } from '../slice/settingsSlice';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  timezone: z.string().min(1, 'Please select a timezone'),
  language: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatar);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: settings.displayName,
      email: settings.email,
      bio: settings.bio,
      timezone: settings.timezone,
      language: settings.language,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    dispatch(updatePreferences({ ...data, avatar: avatarUrl }));
    setSavedSuccess(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #2a2a4a',
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 0.5 }}>
        Profile Settings
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Manage your public identity, contact email, and default regional preferences.
      </Typography>

      {/* Avatar Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar src={avatarUrl} sx={{ width: 72, height: 72, border: '2px solid #7c3aed' }} />
        <Box>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderColor: '#2a2a4a',
              color: '#f1f5f9',
              borderRadius: 2,
              '&:hover': { borderColor: '#7c3aed', background: 'rgba(124,58,237,0.1)' },
            }}
          >
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>
          <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mt: 1 }}>
            JPG, PNG or GIF up to 2MB.
          </Typography>
        </Box>
      </Box>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Display Name"
                fullWidth
                error={Boolean(errors.displayName)}
                helperText={errors.displayName?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bio"
                multiline
                rows={3}
                fullWidth
                error={Boolean(errors.bio)}
                helperText={errors.bio?.message}
              />
            )}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Timezone"
                  fullWidth
                  error={Boolean(errors.timezone)}
                  helperText={errors.timezone?.message}
                >
                  <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                  <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</MenuItem>
                  <MenuItem value="America/New_York">America/New_York (EST -5:00)</MenuItem>
                  <MenuItem value="Europe/London">Europe/London (GMT +0:00)</MenuItem>
                  <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Language" fullWidth>
                  <MenuItem value="en">English (US)</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                fontWeight: 600,
                px: 3,
              }}
            >
              Save Profile
            </Button>
          </Box>
        </Box>
      </form>

      <Snackbar
        open={savedSuccess}
        autoHideDuration={3000}
        onClose={() => setSavedSuccess(false)}
        message="Profile preferences updated successfully"
      />
    </Paper>
  );
}
