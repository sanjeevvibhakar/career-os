package com.sanjeev.careeros.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = configuredUrl;
        }

        HikariConfig config = new HikariConfig();

        // Handle standard Heroku / Render / Neon format: postgres://user:pass@host:port/db
        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(dbUrl);
                String userInfo = uri.getUserInfo();
                String username = configuredUsername;
                String password = configuredPassword;

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String cleanPath = uri.getPath();
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + cleanPath;
                if (uri.getQuery() != null) {
                    jdbcUrl += "?" + uri.getQuery();
                }

                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
            } catch (URISyntaxException e) {
                config.setJdbcUrl(dbUrl);
                config.setUsername(configuredUsername);
                config.setPassword(configuredPassword);
            }
        } else {
            config.setJdbcUrl(dbUrl != null && !dbUrl.isBlank() ? dbUrl : "jdbc:postgresql://localhost:5432/careeros");
            config.setUsername(configuredUsername);
            config.setPassword(configuredPassword);
        }

        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);

        return new HikariDataSource(config);
    }
}
