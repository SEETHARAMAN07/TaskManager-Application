package com.taskmanager.taskmanager.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;

import java.util.function.Function;

@Component
public class JWTUtils {

    private SecretKey Key;
    private  static  final long EXPIRATION_TIME = 86400000;  //24 hours

    public JWTUtils(){
        // the secret key is randomly generated
        String secreteString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        byte[] keyBytes = Base64.getDecoder().decode(secreteString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    // to generate token
    public String generateToken(UserDetails userDetails){

        // to add the role token
        HashMap<String, Object> claims = new HashMap<>();
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        claims.put("role", role);
        // to add token end
        return Jwts.builder()
                .claims(claims) // to add the role
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }

    public  String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails){
        //to add the role
        claims.putIfAbsent("role", userDetails.getAuthorities().stream().findFirst().get().getAuthority()); //to add the role
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }

    // ✅ New method to extract role from the token
    public String extractRole(String token) {
        return extractClaims(token, claims -> claims.get("role", String.class));
    }
    public  String extractUsername(String token){
        return  extractClaims(token, Claims::getSubject);
    }

    // decrypting the token
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(Key).build().parseSignedClaims(token).getPayload());
    }

    // validating the token

    public  boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
 return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public  boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }


}
