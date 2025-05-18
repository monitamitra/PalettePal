package com.palettepal.my_backend.security;

import com.palettepal.my_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service // 👈 this is REQUIRED
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return userRepository.findById(userId)
            .map(user -> {
                return new UserPrincipal(user);
            })
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
    }
}
