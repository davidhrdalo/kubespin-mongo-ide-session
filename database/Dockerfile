FROM mongo:latest

# Set default MongoDB configuration
ENV MONGO_PORT=27017
ENV MONGO_INITDB_ROOT_USERNAME=mongoroot
ENV MONGO_INITDB_ROOT_PASSWORD=rootpassword

# Expose MongoDB port
EXPOSE 27017

# Use the default MongoDB entrypoint
CMD ["mongod", "--bind_ip_all"] 