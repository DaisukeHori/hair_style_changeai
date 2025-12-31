import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    user,
    stylist,
    salon,
    setUser,
    setStylist,
    setSalon,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();

  useEffect(() => {
    // 初期セッションチェック
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });

          // スタイリスト情報を取得
          const { data: stylistData } = await supabase
            .from('stylists')
            .select('*, salon:salons(*)')
            .eq('auth_user_id', session.user.id)
            .single();

          if (stylistData) {
            setStylist(stylistData);
            if (stylistData.salon) {
              setSalon(stylistData.salon);
            }
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // セッション変更リスナー
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });

        // スタイリスト情報を取得
        const { data: stylistData } = await supabase
          .from('stylists')
          .select('*, salon:salons(*)')
          .eq('auth_user_id', session.user.id)
          .single();

        if (stylistData) {
          setStylist(stylistData);
          if (stylistData.salon) {
            setSalon(stylistData.salon);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        logoutStore();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setStylist, setSalon, setLoading, logoutStore]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    logoutStore();
    navigate('/login');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    stylist,
    salon,
    login,
    logout,
    resetPassword,
  };
};
